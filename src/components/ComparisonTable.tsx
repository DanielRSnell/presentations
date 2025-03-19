import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonItem {
  msStack: string[];
  n8nStack: string[];
}

interface ComparisonTableProps {
  title: string;
  items: Record<string, ComparisonItem>;
}

export default function ComparisonTable({ title, items }: ComparisonTableProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="font-bold">Category</div>
          <div className="font-bold">Microsoft CoPilot Stack</div>
          <div className="font-bold">N8N-Based Solution</div>
          
          {Object.entries(items).map(([category, { msStack, n8nStack }], index) => (
            <React.Fragment key={category}>
              <motion.div 
                className="font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {category}
              </motion.div>
              
              <motion.ul 
                className="list-disc pl-5 space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              >
                {msStack.map((item, i) => (
                  <li key={`ms-${i}`}>{item}</li>
                ))}
              </motion.ul>
              
              <motion.ul 
                className="list-disc pl-5 space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {n8nStack.map((item, i) => (
                  <li key={`n8n-${i}`}>{item}</li>
                ))}
              </motion.ul>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
