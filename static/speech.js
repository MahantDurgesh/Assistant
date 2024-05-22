let recognition; // Declare recognition outside the function scope for global access
let currentVoice; // Variable to store the current voice

// Call the startVoiceRecognition function to initiate voice recognition
startVoiceRecognition();

// Function to start voice recognition
function startVoiceRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function() {
        // Show the "I'm listening..." text when voice recognition starts
        document.getElementById('listeningText').style.display = 'block';
    };
    recognition.onresult = handleSpeechResult;
    recognition.onend = function() {
        // Hide the "I'm listening..." text when voice recognition ends
        document.getElementById('listeningText').style.display = 'none';
    };
    recognition.start();
}

// Function to initialize voices
function initializeVoices() {
    const synth = window.speechSynthesis;
    synth.onvoiceschanged = function() {
        const voices = synth.getVoices();
        console.log(voices); // Log available voices to the console
        
        // Set the default voice to Microsoft Ravi - English (India)
        const defaultVoice = voices.find(voice => voice.name === 'Microsoft David - English (United States)');
        if (defaultVoice) {
            currentVoice = defaultVoice;
            console.log('Default voice set to Microsoft David - English (United States)');
        } else {
            console.log('Default voice not found.');
        }
    };
}

function handleSpeechResult(event) {
    const command = event.results[0][0].transcript;
    executeCommand(command);
}

function executeCommand(command) {
    const resultDisplay = document.getElementById('resultDisplay');
    if (command.includes('change your voice') || command.includes('can you change your voice')) {
        // Change voice to Google हिन्दी
        changeVoice('Google हिन्दी');
        resultDisplay.innerHTML = 'Voice changed.';
        return;
    }
    else if (command.toLowerCase().startsWith('search')) {
        // Extract the search query from the command
        const searchQuery = command.substring(7); // Remove 'search ' from the beginning of the command

        // Provide feedback about the search
        const searchFeedback = `Searching for ${searchQuery}...`;
        resultDisplay.innerHTML = searchFeedback;

        // Speak the search feedback
        speakText(searchFeedback);

        // Open Google search with the specified query
        openInSmallWindow(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
    } 
    // Greeting based on time
    else if (command.toLowerCase() === 'hey kalpataru') {
        const greeting = getGreeting();
        resultDisplay.innerHTML = greeting;
        speakText(greeting);
    }

    // Provide news command
    else if (
        command.toLowerCase().includes('provide me top news') ||
        command.toLowerCase().includes('provide me today\'s news') ||
        command.toLowerCase().includes('provide me news')
    ) {
        const newsType = getNewsType(command);
        const newsCommand = `Providing you ${newsType} as per your request.`;
        resultDisplay.innerHTML = newsCommand;
        speakText(newsCommand);

        // Open Google News with the specified query
        openInSmallWindow(`https://news.google.com/search?q=${encodeURIComponent(newsType)}`);
    }

    // Play Music command
    else if (command.toLowerCase().includes('play music')) {
        const { songName, artistName } = extractMusicQuery(command);
        const response = `Playing ${songName} by ${artistName}.`;
        resultDisplay.innerHTML = response;
        speakText(response);

        // Open YouTube Music with the specified query
        openInSmallWindow(`https://music.youtube.com/search?q=${encodeURIComponent(songName + ' ' + artistName)}`);
    }

    // Get Today's Date command
    else if (command.toLowerCase().includes('today\'s date')) {
        const currentDate = getCurrentDate();
        resultDisplay.innerHTML = `Today's date is: ${currentDate}`;
        speakText(`Today's date is: ${currentDate}`);
    }

    else if (
        command.toLowerCase().includes('tell me a joke') ||
        command.toLowerCase().includes('tell me some joke')
    ) {
        const joke = getRandomJoke();
        resultDisplay.innerHTML = joke;
        speakText(joke);
    }
    else if (
        command.toLowerCase().includes('tell me a fact') ||
        command.toLowerCase().includes('tell me some facts')
    ) {
        const fact = getRandomFact();
        resultDisplay.innerHTML = fact;
        speakText(fact);
    }
    else if (
        command.toLowerCase().includes('give me some motivation') ||
        command.toLowerCase().includes('provide a motivation thought')
    ) {
        const motivation = getRandomMotivation();
        resultDisplay.innerHTML = motivation;
        speakText(motivation);
    }
    // Default case
    else {
        resultDisplay.innerHTML = `Command not recognized: ${command}`;
    }
    handleVoiceReply();
}

function changeVoice(voiceName) {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const selectedVoice = voices.find(voice => voice.name === voiceName);

    if (selectedVoice) {
        currentVoice = selectedVoice;
        speakText('Voice changed.'); // Speak "Voice changed" when the voice is changed
        console.log(`Voice changed to ${voiceName}`);
    } else {
        console.log(`Voice "${voiceName}" not found.`);
    }
}

function getGreeting() {
    const currentTime = new Date();
    const hours = currentTime.getHours();

    if (hours < 12) {
        return 'Good morning! How can I help you today?';
    } else if (hours < 18) {
        return 'Good afternoon! What can I assist you with?';
    } else {
        return 'Good evening! How may I help you now?';
    }
}

// Function to speak text
function speakText(text) {
    const speechSynthesis = window.speechSynthesis;

    if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = currentVoice || synth.getVoices()[0];
        speechSynthesis.speak(utterance);
    } else {
        console.error('SpeechSynthesis is not supported in this browser.');
    }
}

function getNewsType(command) {
    if (command.toLowerCase().includes('top news')) {
        return 'top news';
    } else if (command.toLowerCase().includes('today\'s news')) {
        return 'today\'s news';
    } else {
        return 'news';
    }
}

function extractMusicQuery(command) {
    const match = command.match(/play\s(.+)\sby\s(.+)/i);

    if (match && match.length === 3) {
        const songName = match[1].trim();
        const artistName = match[2].trim();
        return { songName, artistName };
    }

    return { songName: command.replace('play music', '').trim(), artistName: '' };
}

function getCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}

function getRandomJoke() {
    const jokes = [
        "Why don't scientists trust stairs? Because they're always up to something!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "I asked the librarian if the library had any books on paranoia. She whispered, 'They're right behind you!'",
        "Why don't skeletons fight each other? They don't have the guts!",
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "Why don't seagulls fly over the bay? Because then they'd be bagels!",
        "I'm on a whiskey diet. I've lost three days already!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "I told my computer I needed a break, and now it won't stop sending me vacation ads!",
        "I told my wife she should embrace her mistakes. She gave me a hug."
    ];
    const randomIndex = Math.floor(Math.random() * jokes.length);
    return jokes[randomIndex];
}

function getRandomFact() {
    const facts = [
        "Bananas are berries, but strawberries aren't: Botanically speaking, bananas are classified as berries because they develop from a flower with a single ovary, while strawberries, despite their name, are not berries. They are actually considered aggregate fruits because they form from a flower with multiple ovaries.",
        "The shortest war in history lasted only 38 minutes: It was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after just 38 minutes.",
        "Cleopatra VII of Egypt lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza: Cleopatra lived from 69 BCE to 30 BCE, while the Great Pyramid of Giza was completed around 2560 BCE. The Moon landing occurred in 1969 CE.",
        "A group of flamingos is called a flamboyance: These brightly colored birds certainly live up to their name when they gather together!",
        "The unicorn is the national animal of Scotland: Despite being a mythical creature, the unicorn has been the national animal of Scotland since the 12th century.",
        "Octopuses have three hearts and blue blood: These fascinating creatures have two hearts that pump blood to their gills and one heart that pumps blood to the rest of their body. Their blood is also blue due to the presence of hemocyanin, a copper-based protein.",
        "Honey never spoils: Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible. Its low water content and acidic pH create an environment that prevents the growth of bacteria and fungi.",
        "The Great Wall of China is not visible from space with the naked eye: Despite the common myth, astronauts need aid such as binoculars or a camera with a zoom lens to see the Great Wall from space.",
        "The Eiffel Tower can be 15 cm taller during the summer: Due to thermal expansion, the iron structure of the Eiffel Tower expands when heated by the sun, causing it to grow in height.",
        "Cows have best friends: Studies have shown that cows form strong bonds with their herd members and often have a best friend within the group whom they prefer to spend time with."
    ];
    const randomIndex = Math.floor(Math.random() * facts.length);
    return facts[randomIndex];
}

function getRandomMotivation() {
    const motivation = [
        "Believe you can and you're halfway there by Theodore Roosevelt",
        "Success is not final, failure is not fatal: It is the courage to continue that counts by Winston Churchill",
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle by Steve Jobs",
        "The only limit to our realization of tomorrow will be our doubts of today by Franklin D. Roosevelt",
        "You are never too old to set another goal or to dream a new dream by C.S. Lewis",
        "The only person you are destined to become is the person you decide to be by Ralph Waldo Emerson",
        "Opportunities don't happen, you create them. by Chris Grosser",
        "You don't have to be great to start, but you have to start to be great. by Zig Ziglar",
        "The future belongs to those who believe in the beauty of their dreams by Eleanor Roosevelt",
        "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. by  Albert Schweitzer"
    ];
    const randomIndex = Math.floor(Math.random() * motivation.length);
    return motivation[randomIndex];
}

/*function handleVoiceReply() {
    // Add your code here to handle voice replies, such as triggering animations or displaying additional information
    toggleEqualizer(); // Example: Toggle the equalizer video
} */

function openInSmallWindow(url) {
    // Calculate the position to center the window
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const windowWidth = 1000; // Width of the small window
    const windowHeight = 350; // Height of the small window
    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;

    // Open a new window with specific dimensions, URL, and centered position
    const smallWindow = window.open(url, '_blank', `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);

    // Check if the small window was successfully opened
    if (!smallWindow) {
        // Handle the case where the window could not be opened
        console.error('Failed to open small window.');
        return;
    }

    // Create a new instance of webkitSpeechRecognition
    const smallWindowRecognition = new webkitSpeechRecognition();
    smallWindowRecognition.lang = 'en-US'; // Set language to English (United States)
    smallWindowRecognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase();
        const scrollStep = 50; // Set the scroll step value

        if (command.includes('scroll up')) {
            smallWindow.scrollBy(0, -scrollStep); // Scroll up
        } else if (command.includes('scroll down')) {
            smallWindow.scrollBy(0, scrollStep); // Scroll down
        }
    };

    // Start recognition immediately after opening the small window
    smallWindowRecognition.start();

    // Add event listener to reset recognition when small window is closed
    smallWindow.addEventListener('unload', function() {
        smallWindowRecognition.start(); // Restart recognition when small window is closed
    });
}

initializeVoices();
// Call the startVoiceRecognition function to initiate voice recognition
startVoiceRecognition();
///