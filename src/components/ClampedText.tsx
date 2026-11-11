import { Box } from '@mui/material';

type ClampedTextProps = {
  text: string;
  lines?: number;
};

export const ClampedText = ({ text, lines = 2 }: ClampedTextProps) => {
  return (
    <Box
      component="span"
      title={text}
      sx={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        overflow: 'hidden',
        overflowWrap: 'anywhere',
      }}
    >
      {text}
    </Box>
  );
};
