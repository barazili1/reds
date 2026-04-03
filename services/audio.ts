import { audioManager } from '../utils/audioManager';

export const playSound = (type: 'click' | 'predict' | 'success' | 'toggle' | 'error') => {
  switch (type) {
    case 'click':
      audioManager.playClick();
      break;
    case 'predict':
      audioManager.playScan();
      break;
    case 'success':
      audioManager.playSuccess();
      break;
    case 'toggle':
      audioManager.playSoftClick();
      break;
    case 'error':
      audioManager.playError();
      break;
    default:
      audioManager.playClick();
  }
};
