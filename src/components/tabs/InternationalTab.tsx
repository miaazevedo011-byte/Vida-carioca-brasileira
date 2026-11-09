import React from 'react';
import { InternationalState } from '../../types/game';
import { Plane, Globe } from 'lucide-react';

interface InternationalTabProps {
  international?: InternationalState;
  onMoveAbroad: (city: string) => { success: boolean; message: string };
}

export const InternationalTab: React.FC<InternationalTabProps> = ({ international, onMoveAbroad }) => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-black font-heading text-[#0B66C3]">Vida no Exterior</h2>
      {!international?.isAbroad ? (
        <div className="space-y-3">
          <p className="text-xs">Mude de país e recomece sua vida.</p>
          {/* List cities here */}
        </div>
      ) : (
        <div className="p-4 bg-[#edf5fd] border border-[#b2d3f5] rounded-2xl">
          <Globe className="w-8 h-8 text-[#0B66C3]" />
          <h3 className="font-bold">Morando em {international.currentCity}</h3>
          <p className="text-xs">Visto: {international.visaStatus}</p>
        </div>
      )}
    </div>
  );
};
