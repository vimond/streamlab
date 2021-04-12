import React, { useEffect, useState } from 'react';
import { Box, Collapse, Flex, IconButton, Input, BoxProps } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Header } from '../store/model/streamDetails';

type Props = BoxProps & {
  headers: Header[];
  onHeadersChange: (headers: Header[]) => void;
};

type AnimatingRowProps = {
  header: Header;
  onChange: (header: Header) => void;
  onDelete: (header: Header) => void;
};

const AnimatingRow = ({ header, onChange, onDelete }: AnimatingRowProps) => {
  const { id, name, value } = header;
  const [isOpen, setIsOpen] = useState(false);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      onDelete(header);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <Collapse key={id} in={isOpen} onAnimationComplete={handleAnimationEnd}>
        <Flex direction="row" py={2}>
          <Input
            flex="1 2 auto"
            placeholder="Header name"
            mr={2}
            value={name}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ name: evt.target.value, value, id })}
          />
          <Input
            flex="2 1 auto"
            placeholder="Header value"
            mr={2}
            value={value}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ name, value: evt.target.value, id })}
          />
          <IconButton flex="0" aria-label="Remove header" icon={<DeleteIcon />} onClick={handleDelete} mr={2} />
        </Flex>
      </Collapse>
    </>
  );
};

const HeaderRows: React.FC<Props> = (props) => {
  const { headers = [], onHeadersChange, ...boxProps } = props;

  const handleChange = (header: Header) => {
    const headersCopy = headers.slice(0);
    const index = headers.findIndex((h) => h.id === header.id);
    if (index >= 0) {
      headersCopy[index] = header;
      onHeadersChange(headersCopy);
    }
  };

  const handleDelete = ({ id }: Header) => {
    const headersCopy = headers.slice(0);
    const index = headers.findIndex((h) => h.id === id);
    if (index >= 0) {
      headersCopy.splice(index, 1);
      onHeadersChange(headersCopy);
    }
  };

  return (
    <Box mb={headers.length ? 4 : 0} {...boxProps}>
      {headers.map &&
        headers.map((h) => <AnimatingRow key={h.id} header={h} onChange={handleChange} onDelete={handleDelete} />)}
    </Box>
  );
};

export default HeaderRows;
