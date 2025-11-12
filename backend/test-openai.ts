import dotenv from 'dotenv';
import { getOpenAIClient, generateCompletion } from './lib/openaiClient';

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

async function testOpenAI() {
  console.log('🧪 Testing OpenAI Connection...\n');

  try {
    // Test 1: Check API key exists
    console.log('✓ Step 1: Checking for API key...');
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    console.log('  ✅ API key found\n');

    // Test 2: Initialize client
    console.log('✓ Step 2: Initializing OpenAI client...');
    const client = getOpenAIClient();
    console.log('  ✅ Client initialized\n');

    // Test 3: Simple completion test
    console.log('✓ Step 3: Testing basic completion...');
    const startTime = Date.now();
    
    const response = await generateCompletion({
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: 'Say "Hello! OpenAI is working correctly." in exactly those words.',
      temperature: 0.3,
      maxTokens: 50,
      model: 'gpt-4'
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('  ✅ Completion successful!');
    console.log(`  ⏱️  Response time: ${duration}s`);
    console.log(`  📝 Response: "${response}"\n`);

    // Test 4: CRM-style prompt test
    console.log('✓ Step 4: Testing CRM-style analysis...');
    const crmStartTime = Date.now();
    
    const crmResponse = await generateCompletion({
      systemPrompt: 'You are an AI Relationship Manager assistant for a CRM system.',
      userPrompt: `Contact: John Doe
Email: john@example.com
Company: Tech Corp

Deals (1):
- Enterprise License: $50,000 (negotiating)

Recent Activities (2):
- [call] Today: Discussed pricing options
- [meeting] 2 days ago: Product demo

Based on this contact's history, provide a brief next action recommendation (1-2 sentences).`,
      temperature: 0.7,
      maxTokens: 200,
      model: 'gpt-4'
    });
    
    const crmEndTime = Date.now();
    const crmDuration = ((crmEndTime - crmStartTime) / 1000).toFixed(2);
    
    console.log('  ✅ CRM analysis successful!');
    console.log(`  ⏱️  Response time: ${crmDuration}s`);
    console.log(`  📝 Response:\n${crmResponse}\n`);

    // Test 5: Contextual Research prompt test
    console.log('✓ Step 5: Testing Contextual Research prompt...');
    const researchStartTime = Date.now();
    
    const researchResponse = await generateCompletion({
      systemPrompt: 'You are an AI Relationship Manager assistant for a CRM system.',
      userPrompt: `Contact: Sarah Johnson
Email: sarah@techstartup.io
Company: Innovation Labs
Position: CTO

Deals (1):
- API Integration Platform: $75,000 (qualified)
  Use Case: Modernize legacy systems

Recent Activities (3):
- [call] Yesterday: Discussed technical architecture and integration requirements
- [meeting] 3 days ago: Technical deep-dive with engineering team
- [email] 1 week ago: Sent whitepaper on microservices migration

Based on this contact's information and interaction history, provide:
1. Key background points about their company/role (2-3 points)
2. Relevant conversation starters (2-3 topics)
3. Questions to ask to deepen the relationship (2-3 questions)
4. Strategic value opportunities (1-2 points)

Keep it concise and actionable.`,
      temperature: 0.7,
      maxTokens: 600,
      model: 'gpt-4'
    });
    
    const researchEndTime = Date.now();
    const researchDuration = ((researchEndTime - researchStartTime) / 1000).toFixed(2);
    
    console.log('  ✅ Contextual Research successful!');
    console.log(`  ⏱️  Response time: ${researchDuration}s`);
    console.log(`  📝 Response:\n${researchResponse}\n`);

    // Summary
    console.log('═══════════════════════════════════════════');
    console.log('🎉 All tests passed!');
    console.log('═══════════════════════════════════════════');
    console.log('✓ API key verification');
    console.log('✓ Client initialization');
    console.log('✓ Basic completion test');
    console.log('✓ CRM next-action analysis');
    console.log('✓ Contextual research analysis');
    console.log('\nYour OpenAI integration is working correctly.');
    console.log('You can now start the backend server with:');
    console.log('  npm run backend:dev\n');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('═══════════════════════════════════════════');
    
    if (error instanceof Error) {
      console.error('Error:', error.message);
      
      // Provide helpful hints based on error
      if (error.message.includes('API key')) {
        console.error('\n💡 Hint: Make sure you have set OPENAI_API_KEY in your .env file');
        console.error('   Get your key from: https://platform.openai.com/api-keys');
      } else if (error.message.includes('401')) {
        console.error('\n💡 Hint: Your API key appears to be invalid');
        console.error('   Check that you copied the full key from OpenAI dashboard');
      } else if (error.message.includes('429')) {
        console.error('\n💡 Hint: Rate limit exceeded or quota reached');
        console.error('   Check your OpenAI account billing and usage limits');
      } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        console.error('\n💡 Hint: Network connectivity issue');
        console.error('   Check your internet connection');
      }
    } else {
      console.error('Unknown error:', error);
    }
    
    console.error('═══════════════════════════════════════════\n');
    process.exit(1);
  }
}

// Run the test
testOpenAI();
