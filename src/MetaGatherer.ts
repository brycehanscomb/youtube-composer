export function initYoutubeAPI() {
    return new Promise(resolve => {
        checkForYoutubePlayer();

        function checkForYoutubePlayer() {
            if (window['YT'] && window['YT'].Player) {
                resolve();
            } else {
                setTimeout(checkForYoutubePlayer, 1000);
            }
        }
    });
}

export function getVideoDuration(videoId: string) : Promise<number> {
    return new Promise(resolve => {
        const targetNode = document.createElement('div');
        targetNode.className = 'hidden';

        document.body.appendChild(targetNode);
        const player = new YT.Player(targetNode as any, {
            events: {
                onReady() {
                    player.setVolume(0);
                    player.cueVideoById(videoId, 0);
                    player.seekTo(0, true);
                },
                onStateChange(event : YT.OnStateChangeEvent) {
                    if (player.getDuration()) {
                        resolve(player.getDuration() * 1000);
                        player.destroy();
                        targetNode.remove();
                    }
                }
            }
        });
    });
}