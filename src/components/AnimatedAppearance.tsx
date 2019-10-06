import React from 'react';
import { Collapse } from '@chakra-ui/core/dist';

type Props = {
  children: React.ReactNode;
  onAdded: () => void;
  onRemoved: () => void;
};

type State = {
  isOpen: boolean;
};

export class AnimatedAppearance extends React.Component<Props, State> {
  componentDidMount() {
    this.setState({ isOpen: true });
  }

  remove = () => {
    this.setState({ isOpen: false });
  };

  handleAnimationEnd = () => {
    const { onAdded, onRemoved } = this.props;
    if (this.state.isOpen) {
      onAdded();
    } else {
      onRemoved();
    }
  };

  render() {
    const { remove, handleAnimationEnd, props, state } = this;
    const { children } = props;
    const { isOpen } = state;
    return (
      <Collapse isOpen={isOpen} onAnimationEnd={handleAnimationEnd}>
        {React.Children.map(children, c => React.isValidElement(c) && React.cloneElement(c, { remove }))}
      </Collapse>
    );
  }
}
