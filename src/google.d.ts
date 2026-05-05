// Type declarations cho Google Identity Services + Google Picker + GAPI

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: {
          access_token?: string;
          expires_in?: number;
          error?: string;
        }) => void;
      }): { requestAccessToken: () => void };
    }
  }

  namespace picker {
    enum ViewId {
      DOCS = "all",
      DOCS_IMAGES = "docs-images",
      DOCUMENTS = "documents",
      SPREADSHEETS = "spreadsheets",
    }

    enum Action {
      PICKED = "picked",
      CANCEL = "cancel",
    }

    class DocsView {
      constructor(viewId?: ViewId);
      setIncludeFolders(include: boolean): DocsView;
      setMimeTypes(mimeTypes: string): DocsView;
    }

    class PickerBuilder {
      addView(view: DocsView): PickerBuilder;
      setOAuthToken(token: string): PickerBuilder;
      setDeveloperKey(key: string): PickerBuilder;
      setLocale(locale: string): PickerBuilder;
      setTitle(title: string): PickerBuilder;
      setCallback(callback: (data: {
        action: string;
        docs?: Array<{
          id: string;
          name: string;
          mimeType: string;
          url: string;
        }>;
      }) => void): PickerBuilder;
      build(): { setVisible: (visible: boolean) => void };
    }
  }
}

declare function gapi_load(api: string, callback: () => void): void;

declare namespace gapi {
  function load(api: string, callback: () => void): void;
}
