export interface NavigationModel {
  navigation: Navigation;
  route: Route;
}

export interface Navigation {}

export interface Route {
  key: string;
  name: string;
  params: number;
}
