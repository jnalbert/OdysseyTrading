import styled from 'styled-components/native';
import { backgroundColor, logoutRed, MulishBold } from './colors';

export const ErrorText = styled.Text`
  color: ${logoutRed};
  font-family: ${MulishBold};
  font-size: 14px;
`

export const StyledScrollView = styled.ScrollView`
  background-color: ${backgroundColor};
`