const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for frontend requests
// Configure body parser with increased limits for resume uploads
app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies with 10MB limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Parse URL-encoded bodies

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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",
});

// Enhanced system prompt for guiding AI responses
const SYSTEM_PROMPT = `You are CareerHunt AI, an advanced AI-powered career advisor and job search expert. You have deep knowledge of modern job markets, industry trends, and career development strategies.

Your capabilities include:
- Analyzing job postings and providing detailed insights
- Offering personalized career advice based on user background
- Suggesting skill development and learning paths
- Providing interview preparation strategies and common questions
- Helping with resume optimization and cover letter writing
- Salary negotiation advice and market research
- Networking strategies and professional relationship building
- Career transition planning and guidance
- Industry-specific insights and trends

Guidelines:
1. Always provide specific, actionable advice tailored to the user's situation
2. When analyzing job listings, highlight opportunities, requirements, and potential concerns
3. Offer concrete strategies with step-by-step guidance
4. Be encouraging but realistic about job prospects and career transitions
5. Ask clarifying questions when you need more context to provide personalized advice
6. Reference specific skills, technologies, or industry knowledge when relevant
7. Provide examples and scenarios to illustrate your points
8. Suggest relevant resources, tools, or platforms when appropriate
9. Maintain a professional, supportive, and motivational tone
10. Adapt your communication style to match the user's experience level
11. IMPORTANT: You are the AI assistant - YOU answer questions, the user asks questions
12. Never include "user:" or "assistant:" prefixes in your responses
13. Always respond directly to the user's question without referencing conversation format
14. Keep responses clean, professional, and well-formatted
15. Remember: You give advice, the user receives advice

Your goal is to be the most helpful career advisor possible, providing expert guidance that leads to meaningful employment opportunities and career growth.`;

// Enhanced API endpoint for chat with better context handling
app.post('/api/chat', async (req, res) => {
  try {
    const { message, jobContext, conversationHistory, userProfile } = req.body;
    
    // Validate required fields
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Build a comprehensive prompt with context
    let fullPrompt = message;
    
    // Helper function to estimate tokens (rough approximation: 1 token ≈ 4 characters)
    const estimateTokens = (text) => Math.ceil(text.length / 4);
    
    // Helper function to truncate text to fit within token limits
    const truncateToFit = (text, maxTokens, reserveForSystem = 1000) => {
      const availableTokens = maxTokens - reserveForSystem;
      const estimatedTokens = estimateTokens(text);
      
      if (estimatedTokens <= availableTokens) {
        return text;
      }
      
      // Calculate how many characters we can keep
      const maxChars = availableTokens * 4;
      return text.substring(0, maxChars) + '\n\n[Content truncated due to length limits]';
    };
    
    // Check if this is a resume analysis request
    const isResumeAnalysis = message.toLowerCase().includes('resume') && 
                             (message.toLowerCase().includes('analyze') || 
                              message.toLowerCase().includes('extract') ||
                              message.toLowerCase().includes('keyword'));
    
    if (isResumeAnalysis) {
      // For resume analysis, be more aggressive with truncation
      const maxResumeTokens = 4000; // Reserve more tokens for system prompt and response
      fullPrompt = truncateToFit(message, maxResumeTokens, 1500);
      console.log('Resume analysis detected - truncated to fit token limits');
    } else {
      // For regular chat, use standard limits
      if (jobContext) {
        const truncatedContext = truncateToFit(jobContext, 6000, 2000);
        fullPrompt += `\n\nJob Context:\n${truncatedContext}`;
      }
      
      if (userProfile) {
        const truncatedProfile = truncateToFit(userProfile, 6000, 2000);
        fullPrompt += `\n\nUser Profile:\n${truncatedProfile}`;
      }
      
      if (conversationHistory && conversationHistory.length > 0) {
        const recentMessages = conversationHistory.slice(-3); // Reduced from 5 to 3 for token efficiency
        const cleanContext = recentMessages.map(msg => {
          const cleanContent = msg.content.replace(/^(user|assistant):\s*/i, '').trim();
          return `${msg.sender === 'user' ? 'User asked' : 'I previously answered'}: ${cleanContent}`;
        }).join('\n');
        
        const truncatedContext = truncateToFit(cleanContext, 6000, 2000);
        fullPrompt += `\n\nPrevious conversation for context:\n${truncatedContext}`;
      }
    }
    
    // Log prompt length for debugging
    const estimatedTokens = estimateTokens(fullPrompt);
    console.log('Estimated tokens:', estimatedTokens);
    console.log('Prompt length:', fullPrompt.split(' ').length, 'words');
    console.log('Sending message to AI:', fullPrompt.substring(0, 100) + '...');
    
    // Ensure we don't exceed token limits
    if (estimatedTokens > 7000) {
      console.log('Warning: Prompt still too long, applying final truncation');
      fullPrompt = truncateToFit(fullPrompt, 7000, 1000);
    }
    
    // Call OpenAI API with enhanced context
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.7
    });
    
    console.log('OpenAI GPT-4 response received successfully');
    
    // Send response back to frontend
    res.json({ 
      content: response.choices[0].message.content,
      model: "gpt-4",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Error calling AI API:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKey: process.env.OPENAI_API_KEY ? 'Configured' : 'Using fallback key'
  });
});

// AI-powered job analysis endpoint
app.post('/api/analyze-job', async (req, res) => {
  try {
    const { jobDescription, userSkills, experienceLevel } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }
    
    const analysisPrompt = `Analyze this job posting and provide insights:

Job Description:
${jobDescription}

User Skills: ${userSkills || 'Not specified'}
Experience Level: ${experienceLevel || 'Not specified'}

Please provide:
1. Key requirements and responsibilities
2. Required vs. preferred qualifications
3. Skills gap analysis (if user skills provided)
4. Salary range estimate (if possible)
5. Application tips and strategies
6. Interview preparation suggestions
7. Career growth potential
8. Red flags or concerns to watch for

Be specific and actionable in your analysis.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 2000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.6
    });

    res.json({
      analysis: response.choices[0].message.content,
      model: "gpt-4",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing job:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to analyze job',
      details: error.response?.data || error.message
    });
  }
});

// AI-powered resume feedback endpoint
app.post('/api/resume-feedback', async (req, res) => {
  try {
    const { resumeContent, jobDescription, targetRole } = req.body;
    
    if (!resumeContent || !jobDescription || !targetRole) {
      return res.status(400).json({ error: 'Resume content, job description, and target role are required' });
    }
    
    const feedbackPrompt = `Provide comprehensive resume feedback for this role:

Target Role: ${targetRole}
Job Description: ${jobDescription}

Resume Content:
${resumeContent}

Please provide:
1. Overall assessment and score (1-10)
2. Strengths and highlights
3. Areas for improvement
4. Specific suggestions for each section
5. Keywords to include for ATS optimization
6. Format and presentation tips
7. Action verbs and power phrases
8. Quantifiable achievements suggestions
9. Skills section optimization
10. Summary/objective recommendations

Be constructive and specific with actionable advice.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 2000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: feedbackPrompt }
      ],
      temperature: 0.5
    });

    res.json({
      feedback: response.choices[0].message.content,
      model: "gpt-4",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error providing resume feedback:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to provide resume feedback',
      details: error.response?.data || error.message
    });
  }
});

// AI-powered interview preparation endpoint
app.post('/api/interview-prep', async (req, res) => {
  try {
    const { jobDescription, role, company, userExperience } = req.body;
    
    if (!jobDescription || !role || !company) {
      return res.status(400).json({ error: 'Job description, role, and company are required' });
    }
    
    const prepPrompt = `Prepare comprehensive interview guidance for this position:

Role: ${role}
Company: ${company}
Job Description: ${jobDescription}
User Experience: ${userExperience || 'Not specified'}

Please provide:
1. Common interview questions for this role
2. Technical questions to expect (if applicable)
3. Behavioral questions and STAR method examples
4. Company research topics and questions to ask
5. Salary negotiation strategies
6. Interview preparation checklist
7. Follow-up email templates
8. Red flags to watch for
9. Success tips and best practices
10. Mock interview scenarios

Be specific and provide examples where possible.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 2000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prepPrompt }
      ],
      temperature: 0.6
    });

    res.json({
      preparation: response.choices[0].message.content,
      model: "gpt-4",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error preparing interview guidance:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to prepare interview guidance',
      details: error.response?.data || error.message
    });
  }
});

// Test endpoint for debugging
app.post('/api/test', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 50,
      messages: [
        { role: "user", content: "Say hello" }
      ]
    });
    
    res.json({
      success: true,
      response: response.choices[0].message.content,
      model: "gpt-4"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔑 API Key: ${process.env.OPENAI_API_KEY ? 'Environment variable' : 'Using provided OpenAI key'}`);
}); 
