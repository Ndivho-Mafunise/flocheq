/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DASHBOARD_URL: string;
  readonly VITE_TRANSACTIONS_URL: string;
  readonly VITE_CUSTOMERS_URL: string;
  readonly VITE_INSIGHTS_URL: string;
  readonly VITE_REPORTS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
