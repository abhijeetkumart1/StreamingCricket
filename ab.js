
        document.addEventListener('DOMContentLoaded', function() {
            const playerContainer = document.getElementById('playerContainer');
            const streamSelector = document.getElementById('streamSelector');
            let currentPlayer = null;

            // Automatically load the first stream
            const firstStreamUrl = streamSelector.options[0].value;
            initPlayer(firstStreamUrl);

            // Handle stream selection change
            streamSelector.addEventListener('change', function() {
                const selectedUrl = this.value;
                if (selectedUrl) {
                    // Destroy previous player if exists
                    if (currentPlayer && currentPlayer.dispose) {
                        currentPlayer.dispose();
                    }
                    
                    initPlayer(selectedUrl);
                }
            });

            function initPlayer(url) {
                // Clear previous content
                playerContainer.innerHTML = '';

                if (isVideoUrl(url)) {
                    // Video Player
                    playerContainer.innerHTML = `
                        <video id="videoPlayer" class="video-js vjs-default-skin" controls preload="auto" data-setup='{}'>
                            <source src="${url}" type="${getVideoType(url)}">
                            Your browser does not support this stream.
                        </video>
                    `;
                    
                    // Initialize Video.js
                    currentPlayer = videojs('videoPlayer', {}, function() {
                        // When player is ready, try to autoplay
                        this.play().catch(error => {
                            console.log('Autoplay was prevented:', error);
                            this.bigPlayButton.show();
                        });
                    });
                    
                    // Handle errors
                    currentPlayer.on('error', function() {
                        playerContainer.innerHTML = `
                            <div class="p-4 text-center text-red-400">
                                Error loading stream. Please try another source.
                            </div>
                        `;
                    });
                } else {
                    // Webpage iframe
                    playerContainer.innerHTML = `
                        <iframe src="${url}" allowfullscreen></iframe>
                    `;
                    currentPlayer = playerContainer.querySelector('iframe');
                }
            }

            // Helper functions
            function isVideoUrl(url) {
                const videoExtensions = ['.m3u8', '.mp4', '.webm', '.mkv', '.mov'];
                return videoExtensions.some(ext => url.toLowerCase().includes(ext));
            }

            function getVideoType(url) {
                if (url.includes('.m3u8')) return 'application/x-mpegURL';
                if (url.includes('.mp4')) return 'video/mp4';
                if (url.includes('.webm')) return 'video/webm';
                return 'video/mp4';
            }
        });

        
        
        
        
        // Social Sharing Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            
            // Set share URLs
            document.getElementById('telegramShare').href = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
            document.getElementById('whatsappShare').href = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
            document.getElementById('facebookShare').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            
            // Copy link functionality
            document.getElementById('copyLink').addEventListener('click', function(e) {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
            
            // Open share links in new tab
            document.querySelectorAll('.share-btn').forEach(btn => {
                if(btn.id !== 'copyLink') {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        window.open(this.href, '_blank', 'width=600,height=400');
                    });
                }
            });
        });
