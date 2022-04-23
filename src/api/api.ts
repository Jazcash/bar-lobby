import * as fs from "fs";
import { TachyonClient } from "tachyon-client";
import { AudioAPI } from "@/api/audio";
import { ContentAPI } from "@/api/content/content";
import { GameAPI } from "@/api/game";
import { ModalsAPI } from "@/api/modals";
import { SessionAPI } from "@/api/session";
import { StoreAPI } from "@/api/store";
import type { Account} from "@/model/account";
import { accountSchema } from "@/model/account";
import type { SettingsType } from "@/model/settings";
import { settingsSchema } from "@/model/settings";
import { ipcRenderer } from "electron";
import type { Info } from "@/model/info";
import { tachyonLog } from "@/utils/tachyon-log";
import { Battle } from "@/model/battle/battle";
import { defaultBattle } from "@/config/default-battle";

interface API {
    info: Info;
    session: SessionAPI;
    settings: StoreAPI<SettingsType>;
    client: TachyonClient;
    audio: AudioAPI;
    modals: ModalsAPI;
    account: StoreAPI<Account>;
    content: ContentAPI;
    game: GameAPI;
    battle: Battle;
}

declare global {
    const api: API;
    interface Window {
        api: API
    }
}

export async function apiInit() {
    window.api = {} as any; // TODO: refactor this, any bad

    api.info = await ipcRenderer.invoke("getInfo");

    api.settings = await new StoreAPI<SettingsType>("settings", settingsSchema, true).init();

    await fs.promises.mkdir(api.settings.model.dataDir.value, { recursive: true });

    const userDataDir = api.info.userDataPath;
    const dataDir = api.settings.model.dataDir.value;

    api.session = new SessionAPI();

    api.client = new TachyonClient({
        host: "server2.beyondallreason.info",
        port: 8202,
        verbose: true,//process.env.NODE_ENV !== "production" // TODO: add toggle to debug tools
        logMethod: tachyonLog
    });
    api.client.socket?.on("connect", () => window.api.session.offlineMode.value = false);
    api.client.socket?.on("close", () => window.api.session.offlineMode.value = true);
    //window.api.client.onResponse("s.system.server_event").add((data) => {
    //    if (event.data === "server_restart") {
    //        window.api.session.model.offline = true;
    //        window.api.modals.show("server_restart");
    //    }
    //}
    //});

    window.api.audio = new AudioAPI().init();

    window.api.modals = new ModalsAPI();

    window.api.account = await new StoreAPI<Account>("account", accountSchema).init();

    window.api.game = new GameAPI(userDataDir, dataDir);

    window.api.content = await new ContentAPI(userDataDir, dataDir).init();

    window.api.battle = new Battle(defaultBattle());
    // reactive(createDeepProxy(new Battle(defaultBattle()), (breadcrumb) => {
    //     const currentBattle = this.currentBattle;

    //     return {
    //         set(target, prop, value) {
    //             if (currentBattle.battleOptions.offline) {
    //                 target[prop as keyof typeof target] = value;
    //             } else {
    //                 // TODO: if set from server data then immediately apply
    //                 // TODO: if set from client then send server request for it
    //                 console.warn("can't set battle property directly");
    //             }
    //             return true;
    //         }
    //     };
    // }, "battle"));
}