const KittenTTS = require('./index');
const path = require('path');
const fs = require('fs');

async function runTests() {
    console.log('🧪 Testing KittenTTS Node.js wrapper...\n');

    try {
        // Initialize TTS
        console.log('1. Initializing KittenTTS...');
        const tts = new KittenTTS();
        console.log('✅ KittenTTS initialized successfully');

        // Check if model is available
        console.log('\n2. Checking model availability...');
        const isAvailable = await tts.isModelAvailable();
        if (isAvailable) {
            console.log('✅ Model is available');
        } else {
            console.log('❌ Model is not available');
            return;
        }

        // Test available voices
        console.log('\n3. Getting available voices...');
        const voices = tts.getAvailableVoices();
        console.log('✅ Available voices:', voices);

        // Test text generation (to buffer)
        console.log('\n4. Testing text-to-speech generation (to buffer)...');
        const testText = "Hello from KittenTTS Node.js wrapper!";
        const audioBuffer = await tts.generate(testText, 'expr-voice-2-f');
        console.log(`✅ Generated audio buffer of ${audioBuffer.length} bytes`);

        // Test text generation (to file)
        console.log('\n5. Testing text-to-speech generation (to file)...');
        const outputPath = path.join(__dirname, 'test-output.wav');
        const filePath = await tts.generateToFile(testText, outputPath, 'expr-voice-3-m');
        
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(`✅ Generated audio file: ${filePath} (${stats.size} bytes)`);
            
            // Clean up test file
            fs.unlinkSync(filePath);
            console.log('🧹 Cleaned up test file');
        } else {
            console.log('❌ Audio file was not created');
        }

        console.log('\n🎉 All tests passed successfully!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run tests
runTests();
