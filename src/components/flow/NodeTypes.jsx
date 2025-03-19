import React from 'react';
import { Handle } from '@xyflow/react';

/**
 * @typedef {Object} NodeData
 * @property {string} label - The label text for the node
 * @property {string} [description] - Optional description for the node
 * @property {string} [domain] - Optional domain for logo
 * @property {string} [direction] - Optional flow direction ('horizontal' or 'vertical')
 */

/**
 * @typedef {Object} NodeProps
 * @property {NodeData} data - The data for the node
 */

// Helper to get logo URL from domain
const getLogoUrl = (domain) => {
  if (!domain) return null;
  return `https://img.logo.dev/${domain}?token=pk_Hxlg889vQvqt4sdTFKgbSw&retina=true`;
};

// Node type components with styling based on cardType
const NodeTypes = {
  // Service node - for API services, functions, etc.
  service: (props) => {
    const isHorizontal = props.data.direction === 'horizontal';
    return (
      <div className={`p-3 rounded-md shadow-md bg-white border-2 border-blue-500 ${isHorizontal ? 'min-w-40' : 'min-w-40'}`}>
        {isHorizontal ? (
          <>
            <Handle type="target" position="left" id="left" />
            <Handle type="source" position="right" id="right" />
          </>
        ) : (
          <>
            <Handle type="target" position="top" id="top" />
            <Handle type="source" position="bottom" id="bottom" />
          </>
        )}
        <div className="flex items-center gap-2">
          {props.data.domain && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={getLogoUrl(props.data.domain)} 
                alt={props.data.label} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-blue-700">{props.data.label}</div>
            {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
          </div>
        </div>
      </div>
    );
  },
  
  // Database node - for data storage components
  database: (props) => {
    const isHorizontal = props.data.direction === 'horizontal';
    return (
      <div className={`p-3 rounded-md shadow-md bg-white border-2 border-green-500 ${isHorizontal ? 'min-w-40' : 'min-w-40'}`}>
        {isHorizontal ? (
          <>
            <Handle type="target" position="left" id="left" />
            <Handle type="source" position="right" id="right" />
          </>
        ) : (
          <>
            <Handle type="target" position="top" id="top" />
            <Handle type="source" position="bottom" id="bottom" />
          </>
        )}
        <div className="flex items-center gap-2">
          {props.data.domain && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={getLogoUrl(props.data.domain)} 
                alt={props.data.label} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-green-700">{props.data.label}</div>
            {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
          </div>
        </div>
      </div>
    );
  },
  
  // Client node - for user interfaces, external systems
  client: (props) => {
    const isHorizontal = props.data.direction === 'horizontal';
    return (
      <div className={`p-3 rounded-md shadow-md bg-white border-2 border-purple-500 ${isHorizontal ? 'min-w-40' : 'min-w-40'}`}>
        {isHorizontal ? (
          <>
            <Handle type="target" position="left" id="left" />
            <Handle type="source" position="right" id="right" />
          </>
        ) : (
          <>
            <Handle type="target" position="top" id="top" />
            <Handle type="source" position="bottom" id="bottom" />
          </>
        )}
        <div className="flex items-center gap-2">
          {props.data.domain && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={getLogoUrl(props.data.domain)} 
                alt={props.data.label} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-purple-700">{props.data.label}</div>
            {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
          </div>
        </div>
      </div>
    );
  },
  
  // API node - for external API services
  api: (props) => {
    const isHorizontal = props.data.direction === 'horizontal';
    return (
      <div className={`p-3 rounded-md shadow-md bg-white border-2 border-orange-500 ${isHorizontal ? 'min-w-40' : 'min-w-40'}`}>
        {isHorizontal ? (
          <>
            <Handle type="target" position="left" id="left" />
            <Handle type="source" position="right" id="right" />
          </>
        ) : (
          <>
            <Handle type="target" position="top" id="top" />
            <Handle type="source" position="bottom" id="bottom" />
          </>
        )}
        <div className="flex items-center gap-2">
          {props.data.domain && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={getLogoUrl(props.data.domain)} 
                alt={props.data.label} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-orange-700">{props.data.label}</div>
            {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
          </div>
        </div>
      </div>
    );
  },
  
  // AI node - for AI/ML components
  ai: (props) => {
    const isHorizontal = props.data.direction === 'horizontal';
    return (
      <div className={`p-3 rounded-md shadow-md bg-white border-2 border-indigo-500 ${isHorizontal ? 'min-w-40' : 'min-w-40'}`}>
        {isHorizontal ? (
          <>
            <Handle type="target" position="left" id="left" />
            <Handle type="source" position="right" id="right" />
          </>
        ) : (
          <>
            <Handle type="target" position="top" id="top" />
            <Handle type="source" position="bottom" id="bottom" />
          </>
        )}
        <div className="flex items-center gap-2">
          {props.data.domain && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={getLogoUrl(props.data.domain)} 
                alt={props.data.label} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-indigo-700">{props.data.label}</div>
            {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
          </div>
        </div>
      </div>
    );
  },
  
  // Integration node - for connector/integration components
  integration: (props) => {
    const isHorizontal = props.data.direction === 'horizontal';
    return (
      <div className={`p-3 rounded-md shadow-md bg-white border-2 border-teal-500 ${isHorizontal ? 'min-w-40' : 'min-w-40'}`}>
        {isHorizontal ? (
          <>
            <Handle type="target" position="left" id="left" />
            <Handle type="source" position="right" id="right" />
          </>
        ) : (
          <>
            <Handle type="target" position="top" id="top" />
            <Handle type="source" position="bottom" id="bottom" />
          </>
        )}
        <div className="flex items-center gap-2">
          {props.data.domain && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={getLogoUrl(props.data.domain)} 
                alt={props.data.label} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="font-bold text-teal-700">{props.data.label}</div>
            {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
          </div>
        </div>
      </div>
    );
  }
};

export default NodeTypes;
