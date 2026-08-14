import React from 'react';
import { BookmarkCheck, Trash2, Calendar, MapPin, ExternalLink, ArrowRight, X } from 'lucide-react';
import { getSavedTripsFromStorage, removeTripFromStorage, SavedTripRecord } from '../utils/storageUtils';
import { ItineraryPlanResponse } from '../types';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrip: (plan: ItineraryPlanResponse) => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({ isOpen, onClose, onSelectTrip }) => {
  const [savedTrips, setSavedTrips] = React.useState<SavedTripRecord[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setSavedTrips(getSavedTripsFromStorage());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeTripFromStorage(id);
    setSavedTrips(getSavedTripsFromStorage());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#1E232B] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-3xl shadow-[8px_8px_0px_0px_#1A1A1A] dark:shadow-[8px_8px_0px_0px_#000000] p-6 sm:p-8 max-h-[85vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#1A1A1A] dark:border-[#384152]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#C5E876] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-2xl shadow-[2px_2px_0px_0px_#1A1A1A]">
              <BookmarkCheck className="w-5 h-5 text-[#1A1A1A]" />
            </span>
            <div>
              <h2 className="text-xl font-black text-[#1A1A1A] dark:text-[#F3F4F6]">Your Saved Trips</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                Trips stored in your local browser storage for quick offline access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F3F4F1] dark:hover:bg-[#28303B] border-2 border-transparent hover:border-[#1A1A1A] dark:hover:border-[#384152] rounded-xl font-black text-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 mx-auto bg-[#FAF9F5] dark:bg-[#14171D] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-2xl flex items-center justify-center mb-3">
                <BookmarkCheck className="w-6 h-6 text-stone-400" />
              </div>
              <p className="font-black text-base text-[#1A1A1A] dark:text-[#F3F4F6]">No Saved Trips Yet</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                Generate an itinerary and click "Save Trip" to bookmark it for future reference.
              </p>
            </div>
          ) : (
            savedTrips.map((record) => (
              <div
                key={record.id}
                onClick={() => {
                  onSelectTrip(record.plan);
                  onClose();
                }}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAF9F5] dark:bg-[#14171D] hover:bg-[#FFFFFF] dark:hover:bg-[#1E232B] border-2 border-[#1A1A1A] dark:border-[#384152] rounded-2xl shadow-[3px_3px_0px_0px_#1A1A1A] dark:shadow-[3px_3px_0px_0px_#000000] hover:translate-y-[-2px] transition-all cursor-pointer gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#3B82F6]" />
                    <span className="font-black text-base text-[#1A1A1A] dark:text-[#F3F4F6] group-hover:text-[#3B82F6] transition-colors">
                      {record.destination}
                    </span>
                    <span className="px-2 py-0.5 bg-[#C5E876] border border-[#1A1A1A] dark:border-[#384152] rounded-lg text-[11px] font-black text-[#1A1A1A]">
                      {record.total_days} Days
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold line-clamp-1">
                    "{record.theme_vibe}"
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      Saved on {new Date(record.savedAt).toLocaleDateString()}
                    </span>
                    {record.start_date && (
                      <span className="font-bold text-[#10B981] dark:text-[#34D399]">
                        Departs: {record.start_date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => handleDelete(record.id, e)}
                    className="p-2 text-stone-400 hover:text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#3E1B1B] border border-transparent hover:border-[#EF4444] rounded-xl transition-all"
                    title="Delete Saved Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1A1A1A] dark:bg-[#C5E876] text-white dark:text-[#1A1A1A] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] group-hover:bg-[#3B82F6] transition-colors">
                    <span>Load Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-200 dark:border-[#384152] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F3F4F1] dark:bg-[#14171D] hover:bg-stone-200 dark:hover:bg-[#28303B] text-[#1A1A1A] dark:text-[#F3F4F6] text-xs font-black border-2 border-[#1A1A1A] dark:border-[#384152] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] dark:shadow-[2px_2px_0px_0px_#000000]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
