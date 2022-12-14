// Create new Castjs instance
const cjs = new Castjs();

// Wait for user interaction
document.getElementById('cast').addEventListener('click', function () {
    // Check if casting is available
    if (cjs.available) {
        // Initiate new cast session with a simple video
        cjs.cast('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4');

        // A more complex example
        cjs.cast('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', {
            poster: 'https://castjs.io/media/poster.jpg',
            title: 'Sintel',
            description: 'Third Open Movie by Blender Foundation',
            subtitles: [{
                active: true,
                label: 'English',
                src: 'https://castjs.io/media/english.vtt'
            }, {
                label: 'Spanish',
                src: 'https://castjs.io/media/spanish.vtt'
            }],
        })
    }
});