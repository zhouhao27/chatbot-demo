import Sound from 'react-native-sound';

class SoundManager {
  private static instance: SoundManager | null = null;
  private currentPlayingSound: Sound | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  /**
   * Gets the singleton instance of the SoundManager.
   */
  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Plays a sound. Stops any currently playing sound.
   * @param sound - An instance of the Sound object to play.
   */
  public playSound(sound: Sound): void {
    if (this.currentPlayingSound && this.isPlaying()) {
      console.log('Stopping currently playing sound');
      this.currentPlayingSound.stop(() => {
        this.currentPlayingSound = null;
      });
    }

    this.currentPlayingSound = sound;

    sound.play((success) => {
      if (success) {
        console.log('Sound finished playing');
      } else {
        console.log('Sound playback failed');
      }
      this.currentPlayingSound = null; // Reset the currently playing sound
    });
  }

  /**
   * Stops the currently playing sound, if any.
   */
  public stopSound(): void {
    if (this.currentPlayingSound) {
      console.log('Stopping current sound');
      this.currentPlayingSound.stop(() => {
        this.currentPlayingSound = null;
      });
    }
  }

  /**
   * Checks if a sound is currently playing.
   * @returns True if a sound is playing, false otherwise.
   */
  public isPlaying(): boolean {
    return this.currentPlayingSound !== null && this.currentPlayingSound.isPlaying();
  }
}

export default SoundManager;
