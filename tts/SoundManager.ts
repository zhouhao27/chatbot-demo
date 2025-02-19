import { setPlayState } from "@/storage";
import Sound from "react-native-sound";

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
  public async playSound(sound: Sound, onComplete?: () => void) {
    this.stopSound(() => {
      console.log("playSound:");
      this.currentPlayingSound = sound;

      sound.play((success) => {
        if (success) {
          setPlayState(false);
          console.log("Sound finished playing");
        } else {
          console.log("Sound playback failed");
        }
        if (onComplete) {
          onComplete();
        }
        this.currentPlayingSound = null; // Reset the currently playing sound
        sound.release(); // Release the sound object
      });
    });
  }

  /**
   * Stops the currently playing sound, if any.
   */
  public async stopSound(onComplete?: () => void) {
    if (this.currentPlayingSound) {
      console.log("Stopping current sound");
      this.currentPlayingSound.stop(() => {
        console.log("Sound stopped");
        this.currentPlayingSound = null;
        if (onComplete) {
          onComplete();
        }
      });
    } else {
      console.log("No sound is currently playing");
      if (onComplete) {
        onComplete();
      }
    }
  }

  /**
   * Checks if a sound is currently playing.
   * @returns True if a sound is playing, false otherwise.
   */
  public isPlaying(): boolean {
    return (
      this.currentPlayingSound !== null && this.currentPlayingSound.isPlaying()
    );
  }
}

export default SoundManager;
