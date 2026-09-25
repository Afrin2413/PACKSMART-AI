import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

interface ScoreRadarProps {
  scores: {
    protection: number;
    shelf_life: number;
    cost: number;
    sustainability: number;
    compatibility: number;
  };
  materialName?: string;
}

export const ScoreRadar: React.FC<ScoreRadarProps> = ({ scores, materialName = 'Material' }) => {
  const data = [
    { subject: 'Protection', score: scores.protection, fullMark: 100 },
    { subject: 'Shelf Life', score: scores.shelf_life, fullMark: 100 },
    { subject: 'Cost Economy', score: scores.cost, fullMark: 100 },
    { subject: 'Sustainability', score: scores.sustainability, fullMark: 100 },
    { subject: 'Compatibility', score: scores.compatibility, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#203128" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#A8C66C', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#2C4136" tick={{ fill: '#7FAF6A', fontSize: 9 }} />
          <Radar
            name={materialName}
            dataKey="score"
            stroke="#7FAF6A"
            fill="#7FAF6A"
            fillOpacity={0.45}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#17221C', borderColor: '#2E5B3D', borderRadius: '8px', color: '#F5F1E8' }}
            formatter={(value: any) => [`${value}/100`, 'Performance Index']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreRadar;
