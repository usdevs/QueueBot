import {type FC, useEffect} from 'react';
import {
  initData,
  useSignal,
} from '@tma.js/sdk-react';
import {Placeholder, Spinner} from '@telegram-apps/telegram-ui';

import { Page } from '@/components/Page.tsx';
import {createPath} from "@/components/utils.ts";
import {useNavigate} from "react-router-dom";

export const InitDataPage: FC = () => {
  const initDataRaw = useSignal(initData.raw);
  const navigate = useNavigate();

  useEffect(() => {

    const initiateAuth = async () => {
      const response = await fetch(createPath('auth'), {
        method: 'GET',
        headers: {
          Authorization: `tma ${initDataRaw}`
        },
      });

      const {token, type} = (await response.json());
      sessionStorage.setItem("jwt", token);
      sessionStorage.setItem("user-type", type);
      navigate("/dashboard");
    }
    initiateAuth();
  }, [initDataRaw]);

  if (!initDataRaw) {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data"
        >
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: 'block', width: '144px', height: '144px' }}
          />
        </Placeholder>
      </Page>
    );
  }
  return (
    <Page>
      <div className={"flex justify-center h-screen items-center"}>
        <Spinner size={"l"}></Spinner>
      </div>
    </Page>
  );
};
