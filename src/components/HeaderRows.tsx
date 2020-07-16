import React from 'react';
import { Box, Collapse, Flex, IconButton, Input } from '@chakra-ui/core';
import { BoxProps } from '@chakra-ui/core/dist/Box';

type Header = { name: string; value: string; id: number };

type Props = BoxProps & {
  headers: Header[];
  onHeadersChange: (headers: Header[]) => void;
};

type State = {
  isOpen: boolean[];
};

class HeaderRows extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: [],
    };
  }

  componentDidMount(): void {
    this.setState({ isOpen: new Array(this.props.headers.length).fill(true) });
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.headers.length < this.props.headers.length) {
      this.setState({
        isOpen: [...this.state.isOpen, true],
      });
    } else if (prevProps.headers.length > this.props.headers.length) {
      this.setState({
        isOpen: new Array(this.props.headers.length).fill(true),
      });
    }
  }

  onDelete = (index: number) => {
    const isOpen = this.state.isOpen;
    isOpen[index] = false;
    this.setState({
      isOpen,
    });
  };

  onChange = (header: Header, index: number) => {
    const headers = this.props.headers.slice(0);
    headers[index] = header;
    this.props.onHeadersChange(headers);
  };

  onAnimationEnd = (index: number) => {
    if (!this.state.isOpen[index]) {
      const headers = this.props.headers.slice(0);
      headers.splice(index, 1);
      this.props.onHeadersChange(headers);
    }
  };

  renderRow = ({ name, value, id }: Header, index: number, arr: Header[]) => {
    return (
      <Collapse key={id} isOpen={this.state.isOpen[index]} onAnimationEnd={() => this.onAnimationEnd(index)}>
        <Flex direction="row" py={2}>
          <Input
            flex="1 2 auto"
            placeholder="Header name"
            mr={2}
            value={name}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              this.onChange({ name: evt.target.value, value, id }, index)
            }
          />
          <Input
            flex="2 1 auto"
            placeholder="Header value"
            mr={2}
            value={value}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
              this.onChange({ name, value: evt.target.value, id }, index)
            }
          />
          <IconButton flex="0" aria-label="Remove" icon="delete" onClick={() => this.onDelete(index)} />
        </Flex>
      </Collapse>
    );
  };

  render() {
    const { headers = [], onHeadersChange, ...boxProps } = this.props;
    return (
      <Box mb={headers.length ? 4 : 0} {...boxProps}>
        {headers.map && headers.map(this.renderRow)}
      </Box>
    );
  }
}

export default HeaderRows;
