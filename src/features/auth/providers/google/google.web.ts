import { loadGoogleGis } from '@/shared/lib/google/loadGoogleGis';

type RenderGoogleButtonOptions = {
  container: HTMLElement;
  onCredential: (idToken: string) => void;
  onError?: (error: Error) => void;
};

let googleInitialized = false;

export const renderGoogleSignInButton = async ({
  container,
  onCredential,
  onError,
}: RenderGoogleButtonOptions) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  if (!clientId) {
    throw new Error('Missing Google web client ID.');
  }

  await loadGoogleGis();

  if (!window.google?.accounts?.id) {
    throw new Error('Google GIS is not available.');
  }

  if (!googleInitialized) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: 'popup',
      callback: (response) => {
        const idToken = response?.credential;

        if (!idToken) {
          onError?.(new Error('No id token returned from Google.'));
          return;
        }

        onCredential(idToken);
      },
    });

    googleInitialized = true;
  }

  container.innerHTML = '';
  container.style.width = '100%';

  const render = () => {
    const width = Math.max(container.getBoundingClientRect().width, 240);

    window.google?.accounts?.id?.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width,
    });
  };

  window.requestAnimationFrame(render);
};
