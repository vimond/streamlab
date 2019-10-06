import React from 'react';
import { Box, Collapse, Flex, IconButton, Input } from '@chakra-ui/core/dist';
import { BoxProps } from '@chakra-ui/core/dist/Box';

type Header = { name: string; value: string };

type Props = BoxProps & {
  headers: Header[];
  onChange: (headers: Header[]) => void;
};

type State = {
  isOpen: boolean[];
};

// Only the last item should expand, i.e. transition isOpen false => true after being added (with falsy value).
// Any item could collapse, i.e. transition isOpen true => false happens. Then it is removed, and the remaining should all have isOpen true.

class HeaderRows extends React.Component<Props, State> {
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (!prevProps.headers || prevProps.headers.length < this.props.headers.length) {
      this.setState({ isOpen: [...this.state.isOpen, true] });
    } else if (prevProps.headers.length > this.props.headers.length) {
      // TODO: Does this happen too early?
      this.setState({ isOpen: new Array(this.props.headers.length).fill(true) });
    }
  }

  onDelete = (index: number) => {
    const isOpen = this.state.isOpen;
    isOpen[index] = false;
    this.setState({
      isOpen
    });
  };

  onChange = (header: Header, index: number) => {
    const headers = this.props.headers.slice(0);
    headers[index] = header;
    this.props.onChange(headers);
  };

  onAnimationEnd = (index: number) => {
    if (!this.state.isOpen[index]) {
      const headers = this.props.headers.slice(0).splice(index, 1);
      this.props.onChange(headers);
    }
  };

  renderRow = ({ name, value }: Header, index: number) => {
    return (
      <Collapse
        key={index}
        isOpen={this.state.isOpen[index]}
        onAnimationEnd={() => this.onAnimationEnd(index)}
      >
        <Flex direction="row" mt={2} mb={4}>
          <Input
            flex="1 2 auto"
            placeholder="Header name"
            mr={2}
            value={name}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              this.onChange({ name: evt.target.value, value }, index)
            }
          />
          <Input
            flex="2 1 auto"
            placeholder="Header value"
            mr={2}
            value={value}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              this.onChange({ name, value: evt.target.value }, index)
            }
          />
          {/*
                // @ts-ignore */}
          <IconButton flex="0" aria-label="Remove" icon="delete" onClick={() => this.onDelete(index)} />
        </Flex>
      </Collapse>
    );
  };

  render() {
    const { headers = [], ...boxProps } = this.props;
    return (
      <Box {...boxProps}>
        {headers.map(this.renderRow)}
      </Box>
    );
  }
}

export default HeaderRows;
