import React from 'react';
import {Box, FormControl, Input, WarningOutlineIcon} from 'native-base';
import {KeyboardTypeOptions} from 'react-native';

type InputProps = {
  onChangeText: (value: string) => void;
  inputKey?: string;
  label: string;
  isRequired?: boolean;
  type?: 'text' | 'password';
  warningMessage?: string;
  placeholder?: string;
  rightIcon?: JSX.Element | JSX.Element[];
  keyboardType?: KeyboardTypeOptions;
  defaultValue?: string;
  isReadOnly?: boolean;
  isInvalid?: boolean;
};

const BaseInput: React.FC<InputProps> = props => {
  return (
    <Box mt={2} w="100%">
      <FormControl isInvalid={props.isInvalid} isRequired={props.isRequired}>
        <FormControl.Label>{props.label}</FormControl.Label>
        <Input
          isReadOnly={props.isReadOnly}
          defaultValue={props.defaultValue}
          onChangeText={text => props.onChangeText(text)}
          type={props.type}
          placeholder={props.placeholder}
          InputRightElement={props.rightIcon}
          keyboardType={props.keyboardType ?? 'default'}
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {props.warningMessage}
        </FormControl.ErrorMessage>
      </FormControl>
    </Box>
  );
};

export default BaseInput;
