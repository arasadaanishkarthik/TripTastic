// src/components/itinerary/EditItineraryModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, IndianRupee, MapPin, Tag, Save, Check } from 'lucide-react';
import { Button } from '../Button';

const CATEGORIES = [
  'Culture', 'Nature', 'Adventure', 'Food', 'Photography', 'Shopping', 'Relaxation', 'Transport'
];

export const EditItineraryModal = ({ isOpen, onClose, itinerary, onSave }) => {
  const [editedItinerary, setEditedItinerary] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // New activity input form state
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'Culture',
    time: '11:00',
    cost: 200,
    duration: '1.5 hours',
    description: '',
    location: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (itinerary) {
      // Deep copy to allow isolated editing
      setEditedItinerary(JSON.parse(JSON.stringify(itinerary)));
      setSelectedDayIndex(0);
      setShowAddForm(false);
    }
  }, [itinerary, isOpen]);

  if (!isOpen || !editedItinerary) return null;

  const currentDay = editedItinerary.days?.[selectedDayIndex];

  const handleUpdateActivity = (actIdx, field, value) => {
    setEditedItinerary((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy.days[selectedDayIndex]?.activities[actIdx]) {
        copy.days[selectedDayIndex].activities[actIdx][field] = value;
      }
      return copy;
    });
  };

  const handleDeleteActivity = (actIdx) => {
    setEditedItinerary((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy.days[selectedDayIndex]?.activities) {
        copy.days[selectedDayIndex].activities.splice(actIdx, 1);
      }
      return copy;
    });
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    setEditedItinerary((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const targetDay = copy.days[selectedDayIndex];
      if (!targetDay.activities) targetDay.activities = [];

      const activityToAdd = {
        id: `custom-d${selectedDayIndex + 1}-${Date.now()}`,
        title: newActivity.title.trim(),
        category: newActivity.category,
        time: newActivity.time || '10:00',
        cost: Number(newActivity.cost) || 0,
        duration: newActivity.duration || '1.5 hours',
        description: newActivity.description.trim() || `Experience ${newActivity.title} in ${editedItinerary.destination?.name || 'the area'}.`,
        location: newActivity.location.trim() || editedItinerary.destination?.name || 'Local Area',
        latitude: editedItinerary.destination?.latitude || null,
        longitude: editedItinerary.destination?.longitude || null,
      };

      targetDay.activities.push(activityToAdd);
      // Sort activities chronologically
      targetDay.activities.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      return copy;
    });

    setNewActivity({
      title: '',
      category: 'Culture',
      time: '11:00',
      cost: 200,
      duration: '1.5 hours',
      description: '',
      location: '',
    });
    setShowAddForm(false);
  };

  const handleSaveAll = () => {
    // Recalculate total budget if per-person changed
    const perPerson = Number(editedItinerary.budget?.perPerson) || 5000;
    const travelers = Number(editedItinerary.travelers) || 2;
    editedItinerary.budget = {
      ...editedItinerary.budget,
      perPerson,
      total: perPerson * travelers,
    };

    if (onSave) {
      onSave(editedItinerary);
    }
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl my-auto rounded-3xl bg-surface border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/90 backdrop-blur-md shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
              Trip Editor
            </span>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl uppercase text-text-main">
              Customize Itinerary: {editedItinerary.destination?.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-text-main">
          {/* Top Quick Settings: Tagline & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
            <div>
              <label className="text-[11px] font-bold uppercase text-text-secondary block mb-1">
                Trip Tagline
              </label>
              <input
                type="text"
                value={editedItinerary.destination?.tagline || ''}
                onChange={(e) =>
                  setEditedItinerary((prev) => ({
                    ...prev,
                    destination: { ...prev.destination, tagline: e.target.value },
                  }))
                }
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-surface border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-text-secondary block mb-1">
                Budget Per Person (₹)
              </label>
              <input
                type="number"
                value={editedItinerary.budget?.perPerson || 5000}
                onChange={(e) =>
                  setEditedItinerary((prev) => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      perPerson: Number(e.target.value),
                      total: Number(e.target.value) * (prev.travelers || 2),
                    },
                  }))
                }
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-surface border border-border focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Day Selector Tabs */}
          <div>
            <span className="text-[11px] font-bold uppercase text-text-secondary block mb-2">
              Select Day to Edit
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {editedItinerary.days?.map((d, idx) => (
                <button
                  key={d.day || idx}
                  onClick={() => {
                    setSelectedDayIndex(idx);
                    setShowAddForm(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedDayIndex === idx
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-black/5 dark:bg-white/5 text-text-secondary hover:text-text-main'
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>
          </div>

          {/* Current Day Title Editor */}
          {currentDay && (
            <div>
              <label className="text-[11px] font-bold uppercase text-text-secondary block mb-1">
                Day {currentDay.day} Theme Title
              </label>
              <input
                type="text"
                value={currentDay.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditedItinerary((prev) => {
                    const copy = JSON.parse(JSON.stringify(prev));
                    copy.days[selectedDayIndex].title = val;
                    return copy;
                  });
                }}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-surface border border-border focus:border-primary focus:outline-none"
              />
            </div>
          )}

          {/* Activities List for Selected Day */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-text-secondary">
                Activities ({currentDay?.activities?.length || 0})
              </span>
              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                {showAddForm ? 'Cancel Add' : 'Add Activity'}
              </button>
            </div>

            {/* Add Activity Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddActivity}
                className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
              >
                <span className="text-xs font-bold text-primary block">
                  New Activity on Day {currentDay?.day}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Activity or Place Name *"
                    required
                    value={newActivity.title}
                    onChange={(e) => setNewActivity((p) => ({ ...p, title: e.target.value }))}
                    className="text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none"
                  />
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity((p) => ({ ...p, category: e.target.value }))}
                    className="text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Time (e.g. 10:30)"
                    value={newActivity.time}
                    onChange={(e) => setNewActivity((p) => ({ ...p, time: e.target.value }))}
                    className="text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Est. Cost (₹)"
                    value={newActivity.cost}
                    onChange={(e) => setNewActivity((p) => ({ ...p, cost: e.target.value }))}
                    className="text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 2 hrs)"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity((p) => ({ ...p, duration: e.target.value }))}
                    className="text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location / Area"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity((p) => ({ ...p, location: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none"
                />
                <textarea
                  placeholder="Short description / travel notes"
                  rows={2}
                  value={newActivity.description}
                  onChange={(e) => setNewActivity((p) => ({ ...p, description: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none resize-none"
                />
                <Button variant="primary" size="sm" type="submit" icon={Plus}>
                  Add to Day {currentDay?.day}
                </Button>
              </form>
            )}

            {/* List of current activities */}
            <div className="space-y-3">
              {currentDay?.activities?.map((act, actIdx) => (
                <div
                  key={act.id || actIdx}
                  className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={act.title || ''}
                        onChange={(e) => handleUpdateActivity(actIdx, 'title', e.target.value)}
                        placeholder="Activity title"
                        className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-surface border border-border focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={act.category || 'Culture'}
                          onChange={(e) => handleUpdateActivity(actIdx, 'category', e.target.value)}
                          className="text-[11px] font-semibold px-2 py-1.5 rounded-lg bg-surface border border-border focus:outline-none"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={act.time || ''}
                          onChange={(e) => handleUpdateActivity(actIdx, 'time', e.target.value)}
                          placeholder="Time"
                          className="w-20 text-[11px] px-2 py-1.5 rounded-lg bg-surface border border-border focus:outline-none"
                        />
                        <div className="flex items-center text-[11px] text-primary font-bold">
                          ₹
                          <input
                            type="number"
                            value={act.cost ?? 0}
                            onChange={(e) =>
                              handleUpdateActivity(actIdx, 'cost', Number(e.target.value))
                            }
                            className="w-16 ml-0.5 px-1.5 py-1 rounded-lg bg-surface border border-border focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteActivity(actIdx)}
                      title="Delete activity"
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={act.location || ''}
                    onChange={(e) => handleUpdateActivity(actIdx, 'location', e.target.value)}
                    placeholder="Location / Landmark"
                    className="w-full text-[11px] text-text-secondary px-2.5 py-1 rounded-lg bg-surface border border-border focus:outline-none"
                  />

                  <textarea
                    rows={2}
                    value={act.description || ''}
                    onChange={(e) => handleUpdateActivity(actIdx, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full text-[11px] text-text-secondary px-2.5 py-1 rounded-lg bg-surface border border-border focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface/90 backdrop-blur-md shrink-0">
          <span className="text-xs text-text-secondary">
            Changes will update all metrics, timelines, map points & budget.
          </span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={isSavedToast ? Check : Save}
              onClick={handleSaveAll}
            >
              {isSavedToast ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};