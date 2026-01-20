import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Box, Paper } from '@mui/material';

const VirtualizedList = ({ 
  items, 
  itemHeight = 80, 
  height = 400, 
  renderItem,
  overscan = 5 
}) => {
  const memoizedItems = useMemo(() => items, [items]);

  const Row = ({ index, style }) => (
    <div style={style}>
      {renderItem(memoizedItems[index], index)}
    </div>
  );

  if (!memoizedItems || memoizedItems.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={height}
      >
        <Paper sx={{ p: 3 }}>
          No items to display
        </Paper>
      </Box>
    );
  }

  return (
    <List
      height={height}
      itemCount={memoizedItems.length}
      itemSize={itemHeight}
      overscanCount={overscan}
      width="100%"
    >
      {Row}
    </List>
  );
};

export default React.memo(VirtualizedList);