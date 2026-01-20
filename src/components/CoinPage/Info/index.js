import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { ExpandMore, ExpandLess, Info as InfoIcon } from "@mui/icons-material";
import "./styles.css";

function Info({ title, desc }) {
  const [expanded, setExpanded] = useState(false);
  const safeDesc = desc || 'No description available for this cryptocurrency.';
  const shouldTruncate = safeDesc && safeDesc.length > 300;
  const displayDesc = shouldTruncate && !expanded ? safeDesc.slice(0, 300) + '...' : safeDesc;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InfoIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          About {title || 'Cryptocurrency'}
        </Typography>
      </Box>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.primary',
          lineHeight: 1.7,
          fontSize: '1rem',
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }
        }}
        dangerouslySetInnerHTML={{ __html: displayDesc }}
      />
      
      {shouldTruncate && (
        <Button
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ 
            mt: 2, 
            color: 'primary.main',
            textTransform: 'none',
            fontSize: '0.9rem'
          }}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </Box>
  );
}

export default Info;
