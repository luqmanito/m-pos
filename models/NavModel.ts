export interface NavigationModel {
  navigation: Navigation;
  route: Route;
}

export interface Route {
  key: string;
  name: string;
  params: number;
}

export interface Navigation {}
