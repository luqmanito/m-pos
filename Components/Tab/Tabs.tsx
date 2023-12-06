import React, {useState} from 'react';
import {View} from 'native-base'; // Adjust the import path
import TabButton from './TabButton'; // Adjust the import path

interface TabsProps {
  tabs: {label: string; tab: string}[];
  onTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({tabs, onTabChange}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].tab);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View mt={4} mb={4} flexDirection={'row'}>
      {tabs.map(tabInfo => (
        <TabButton
          key={tabInfo.tab}
          label={tabInfo.label}
          isActive={activeTab === tabInfo.tab}
          onPress={() => handleTabPress(tabInfo.tab)}
          width={100 / tabs.length}
        />
      ))}
    </View>
  );
};

export default Tabs;
