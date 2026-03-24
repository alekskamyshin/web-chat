const GOOGLE_GIS_SRC = 'https://accounts.google.com/gsi/client';

let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: 'popup' | 'redirect';
          }) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
          }) => void) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?:
                | 'signin_with'
                | 'signup_with'
                | 'continue_with'
                | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

export const loadGoogleGis = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google GIS is only available in the browser.'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
			console.log('appending gis')
      const script = document.createElement('script');
      script.src = GOOGLE_GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google GIS.'));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
};
