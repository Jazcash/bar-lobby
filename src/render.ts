import "vue-next-select/dist/index.css";
import "vue-slider-component/theme/default.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "@/assets/styles/styles.scss";

import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import type { ComponentPublicInstance, TransitionProps } from "vue";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

import { apiInit } from "@/api/api";
import App from "@/App.vue";
import routes from "@/routes";
import { clickAwayDirective } from "@/utils/click-away-directive";

declare module "vue-router" {
    interface RouteMeta {
        title?: string;
        order?: number;
        offline?: boolean;
        empty?: boolean;
        blurBg?: boolean;
        transition?: TransitionProps;
    }
}

(async () => {
    await apiInit();

    await setupVue();

    document.addEventListener("keydown", (event) => {
        if (event.code === "F11") {
            event.preventDefault();
        }
    });
})();

async function setupVue() {
    const router = createRouter({
        history: createWebHashHistory(),
        routes: routes,
    });

    const app = createApp(App);

    app.use(router);

    app.use(PrimeVue);

    app.directive("click-away", clickAwayDirective);
    app.directive("tooltip", Tooltip);

    app.mount("#app");

    app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
        api.session.error.err = err;
        api.session.error.instance = instance;
        api.session.error.info = info;
    };

    if (process.env.NODE_ENV !== "production") {
        app.config.globalProperties.window = window;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).router = router;
    }
}
