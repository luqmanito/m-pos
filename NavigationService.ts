import {NavigationContainerRef, CommonActions} from '@react-navigation/native';

let navigator: NavigationContainerRef<any> | null;

function setTopLevelNavigator(
  navigatorRef: NavigationContainerRef<any> | null,
) {
  navigator = navigatorRef;
}

function navigate(routeName: string, params?: Record<string, any>) {
  navigator?.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    }),
  );
}

export default {
  setTopLevelNavigator,
  navigate,
};
