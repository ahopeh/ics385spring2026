import { useState } from 'react';

const SISTER_PROPERTIES = [
    'Hilo Garden B&B',
    'Kona Coast Vacation Rental',
    'Waimea Ranch Hotel',
    'Waipio Valley Honeymoon Cottage'
];

export default function InquiryModal({ guestType, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        preferredDates: '',
        message: '',
        guestType: guestType,
        // Research fields
        affiliation: '',
        researchFocus: '',
        facilityInterest: {
            labSpace: false,
            quietStudyRooms: false,
            equipmentStorage: false
        },
        // Leisure fields
        sisterPropertyInterest: [],
        extendedStayInterest: false
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('facility_')) {
            const field = name.replace('facility_', '');
            setFormData(prev => ({
                ...prev,
                facilityInterest: { ...prev.facilityInterest, [field]: checked }
            }));
        } else if (name === 'sisterProperty') {
            setFormData(prev => {
                const current = prev.sisterPropertyInterest;
                return {
                    ...prev,
                    sisterPropertyInterest: checked
                        ? [...current, value]
                        : current.filter(p => p !== value)
                };
            });
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch('http://localhost:3000/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Unable to submit. Please try again.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                {submitted ? (
                    <div className="modal-success">
                        <div className="success-icon">🌺</div>
                        <h2>Mahalo!</h2>
                        <p>Your inquiry has been received. We'll be in touch within 2 business days.</p>
                        <button className="modal-btn" onClick={onClose}>Close</button>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>{guestType === 'research' ? '🔬 Plan a Research Visit' : '🌿 Book a Stay'}</h2>
                            <p>{guestType === 'research'
                                ? 'Tell us about your research goals and we\'ll help plan your visit.'
                                : 'Let us know your preferred dates and interests.'
                            }</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Shared fields */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" required
                                        placeholder="Your name"
                                        value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" required
                                        placeholder="your@email.com"
                                        value={formData.email} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="preferredDates">Preferred Dates</label>
                                <input type="text" id="preferredDates" name="preferredDates"
                                    placeholder="e.g. June 15–22, 2026 or flexible"
                                    value={formData.preferredDates} onChange={handleChange} />
                            </div>

                            {/* Research-specific fields */}
                            {guestType === 'research' && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="affiliation">Affiliation</label>
                                            <input type="text" id="affiliation" name="affiliation"
                                                placeholder="University, organization, or independent"
                                                value={formData.affiliation} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="researchFocus">Research Focus</label>
                                            <input type="text" id="researchFocus" name="researchFocus"
                                                placeholder="e.g. volcanology, ethnobotany"
                                                value={formData.researchFocus} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Research Facility Interest</label>
                                        <div className="checkbox-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" name="facility_labSpace"
                                                    checked={formData.facilityInterest.labSpace}
                                                    onChange={handleChange} />
                                                Lab Space
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" name="facility_quietStudyRooms"
                                                    checked={formData.facilityInterest.quietStudyRooms}
                                                    onChange={handleChange} />
                                                Quiet Study Rooms
                                            </label>
                                            <label className="checkbox-label">
                                                <input type="checkbox" name="facility_equipmentStorage"
                                                    checked={formData.facilityInterest.equipmentStorage}
                                                    onChange={handleChange} />
                                                Equipment Storage
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Leisure-specific fields */}
                            {guestType === 'leisure' && (
                                <>
                                    <div className="form-group">
                                        <label>Sister Property Excursion Interest</label>
                                        <p className="field-note">In the event of unfavorable volcanic conditions,
                                            guests may be redirected to our partner properties.</p>
                                        <div className="checkbox-group">
                                            {SISTER_PROPERTIES.map(property => (
                                                <label key={property} className="checkbox-label">
                                                    <input type="checkbox" name="sisterProperty"
                                                        value={property}
                                                        checked={formData.sisterPropertyInterest.includes(property)}
                                                        onChange={handleChange} />
                                                    {property}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="extendedStayInterest"
                                                checked={formData.extendedStayInterest}
                                                onChange={handleChange} />
                                            I'm interested in extended stay discount pricing across sister properties
                                        </label>
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label htmlFor="message">Additional Notes</label>
                                <textarea id="message" name="message" rows="3"
                                    placeholder="Anything else you'd like us to know..."
                                    value={formData.message} onChange={handleChange} />
                            </div>

                            {error && <p className="form-error">{error}</p>}

                            <button type="submit" className="modal-btn">Send Inquiry</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}