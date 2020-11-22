import React, { useEffect, useRef, useState } from 'react';
import { Box, Collapse, Flex, IconButton, Input, BoxProps } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

type Header = { name: string; value: string; id: number };

type Props = BoxProps & {
  headers: Header[];
  onHeadersChange: (headers: Header[]) => void;
};

const renderRow = (
  isOpen: boolean[],
  onChange: (header: Header, index: number) => void,
  onAnimationEnd: (index: number) => void,
  onDelete: (index: number) => void
) => ({ name, value, id }: Header, index: number, arr: Header[]) => {
  return (
    <Collapse key={id} in={isOpen[index]} onAnimationComplete={() => onAnimationEnd(index)}>
      <Flex direction="row" py={2}>
        <Input
          flex="1 2 auto"
          placeholder="Header name"
          mr={2}
          value={name}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ name: evt.target.value, value, id }, index)
          }
        />
        <Input
          flex="2 1 auto"
          placeholder="Header value"
          mr={2}
          value={value}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ name, value: evt.target.value, id }, index)
          }
        />
        <IconButton flex="0" aria-label="Remove" icon={<DeleteIcon />} onClick={() => onDelete(index)} mr={2} />
      </Flex>
    </Collapse>
  );
};

const HeaderRows: React.FC<Props> = (props) => {
  const { headers = [], onHeadersChange, ...boxProps } = props;

  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const headersRef = useRef<Header[]>();

  useEffect(() => {
    const prev = headersRef.current;
    if (prev) {
      if (prev.length < headers.length) {
        setIsOpen([...isOpen, true]);
      } else if (prev.length > headers.length) {
        setIsOpen(new Array(headers.length).fill(true));
      }
    } else {
      setIsOpen(new Array(headers.length).fill(true));
    }
    headersRef.current = headers;
  }, [headers, isOpen]);

  const handleChange = (header: Header, index: number) => {
    const headersCopy = headers.slice(0);
    headersCopy[index] = header;
    onHeadersChange(headersCopy);
  };

  const handleDelete = (index: number) => {
    isOpen[index] = false;
    setIsOpen([...isOpen]);
  };

  const handleAnimationEnd = (index: number) => {
    if (!isOpen[index]) {
      const headersCopy = headers.slice(0);
      headersCopy.splice(index, 1);
      onHeadersChange(headersCopy);
    }
  };

  return (
    <Box mb={headers.length ? 4 : 0} {...boxProps}>
      {headers.map && headers.map(renderRow(isOpen, handleChange, handleAnimationEnd, handleDelete))}
    </Box>
  );
};

export default HeaderRows;
