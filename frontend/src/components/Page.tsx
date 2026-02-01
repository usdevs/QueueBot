import { backButton, miniApp } from '@tma.js/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        miniApp.close();
      });
    }
    backButton.hide();
  }, [back]);

  return <>{children}</>;
}