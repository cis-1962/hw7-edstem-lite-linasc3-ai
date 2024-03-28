declare namespace CookieSessionInterfaces {
    interface CookieSessionObject {
      user?: {
        id: string; 
        username: string; 
      }
    }
  }

  // extend session object interface to include properties 