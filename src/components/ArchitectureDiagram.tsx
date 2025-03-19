import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface ComponentProps {
  name: string;
  description?: string;
  color?: string;
}

interface ConnectionProps {
  from: string;
  to: string;
  label?: string;
}

interface ArchitectureDiagramProps {
  title: string;
  components: ComponentProps[];
  connections: ConnectionProps[];
}

export default function ArchitectureDiagram({ 
  title, 
  components, 
  connections 
}: ArchitectureDiagramProps) {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      
      <motion.div 
        className="grid grid-cols-3 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {components.map((component, index) => (
          <motion.div key={component.name} variants={itemVariants}>
            <Card className={`border-l-4 ${component.color || 'border-primary'}`}>
              <CardContent className="p-4">
                <h4 className="font-bold" id={component.name.replace(/\s+/g, '-').toLowerCase()}>
                  {component.name}
                </h4>
                {component.description && (
                  <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-sm text-muted-foreground">
        <h4 className="font-medium mb-2">Connections:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {connections.map((connection, index) => (
            <motion.li 
              key={`${connection.from}-${connection.to}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
            >
              {connection.from} → {connection.to}
              {connection.label && ` (${connection.label})`}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
