import React from 'react';
import { Heading } from '@chakra-ui/core';
import { HeadingProps } from '@chakra-ui/core/dist/Heading';

export enum Level {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6'
}

const getStyles = (level: Level): HeadingProps => {
  switch (level) {
    case Level.H1:
      return {
        size: 'md',
        my: 1,
        mx: 4,
        px: 1
      };
    case Level.H2:
      return {
        size: 'sm',
        m: 0,
        p: 1,
        textAlign: 'left'
      };
    case Level.H3:
      return {
        size: 'md',
        my: 4
      };
    case Level.H4:
      return {
        size: 'sm',
        my: 4
      };
    case Level.H6:
      return {
        size: 'sm',
        fontWeight: 'normal',
        justifySelf: 'center'
      };
    default:
      return {
        size: 'sm'
      };
  }
};

type Props = HeadingProps & {
  level: Level;
  children: React.ReactNode;
};

const Header: React.FC<Props> = ({ level, children, ...headingProps }: Props) => (
  <Heading as={level} {...getStyles(level)} {...headingProps}>
    {children}
  </Heading>
);

export default Header;
