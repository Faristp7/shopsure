'use strict';

import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface ProductVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export const ProductVideo: React.FC<ProductVideoProps> = ({
  videoUrl,
  thumbnailUrl,
  title = 'Product Video',
  autoplay = false,
  loop = true,
  muted = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);

  // Parse type of video (Youtube, Vimeo, or HTML5 native video)
  const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
      } else {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        videoId = match && match[2].length === 11 ? match[2] : '';
      }
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${
            muted ? 1 : 0
          }&loop=${loop ? 1 : 0}&playlist=${videoId}&controls=1`
        : url;
    } catch (e) {
      return url;
    }
  };

  const getVimeoEmbedUrl = (url: string) => {
    try {
      const match = url.match(/vimeo\.com\/(\d+)/);
      const videoId = match ? match[1] : '';
      return videoId
        ? `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${
            muted ? 1 : 0
          }&loop=${loop ? 1 : 0}&autopause=0`
        : url;
    } catch (e) {
      return url;
    }
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 text-center text-gray-500 border border-gray-200 ${className}`}>
        <RotateCcw className="w-12 h-12 mb-3 stroke-[1.5] text-gray-400" />
        <p className="font-medium text-sm">Failed to load video</p>
        <button
          onClick={() => setHasError(false)}
          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 underline transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-black aspect-video group shadow-lg ${className}`}>
      {isYoutube ? (
        <iframe
          src={getYoutubeEmbedUrl(videoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
          onError={() => setHasError(true)}
        />
      ) : isVimeo ? (
        <iframe
          src={getVimeoEmbedUrl(videoUrl)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
          onError={() => setHasError(true)}
        />
      ) : (
        // Native HTML5 video player with custom overlays
        <div className="relative w-full h-full">
          <video
            src={videoUrl}
            poster={thumbnailUrl}
            autoPlay={autoplay}
            loop={loop}
            muted={isMuted}
            playsInline
            controls={false}
            className="w-full h-full object-cover"
            onClick={() => setIsPlaying(!isPlaying)}
            ref={(el) => {
              if (el) {
                if (isPlaying) {
                  el.play().catch(() => setIsPlaying(false));
                } else {
                  el.pause();
                }
              }
            }}
            onError={() => setHasError(true)}
          />

          {/* Centered Play Button when Paused */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 m-auto w-16 h-16 bg-white/95 text-gray-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-white active:scale-95 transition-all duration-300 z-10"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          )}

          {/* Bottom Custom Control Overlays */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-blue-400 transition"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <span className="w-5 h-5 block border-2 border-white rounded-sm border-r-0 border-l-0 relative after:content-[''] after:absolute after:h-full after:w-[3px] after:bg-white after:left-[4px] before:content-[''] before:absolute before:h-full before:w-[3px] before:bg-white before:right-[4px]" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-blue-400 transition"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            
            <p className="text-white/95 text-xs font-semibold tracking-wide drop-shadow truncate max-w-[60%]">
              {title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
