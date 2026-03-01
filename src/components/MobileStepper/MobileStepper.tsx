import React from 'react';
import './MobileStepper.css';

export interface Step {
    title: string;
    description?: string;
    isDone?: boolean;
    showDescriptionIfDone?: boolean;
}

interface MobileStepperProps {
    steps: Step[];
    currentStep: number;
}

const MobileStepper: React.FC<MobileStepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="mobile-stepper">
            {steps.map((step, index) => {
                const isDone = step.isDone ?? (index < currentStep);
                const isActive = index === currentStep;
                const isLast = index === steps.length - 1;
                const isFinalized = isLast && currentStep >= steps.length;

                let stateClass = 'inactive';
                if (isFinalized) stateClass = 'finalized';
                else if (isDone) {
                    stateClass = isLast ? 'success' : 'done';
                }
                else if (isActive) stateClass = 'active';

                const nextStepIsActiveOrDone = index + 1 <= currentStep || (index < steps.length - 1 && steps[index+1].isDone) || isDone;

                return (
                    <div key={index} className={`stepper-item ${stateClass}`}>
                        <div className="stepper-left-column">
                            <div className="stepper-circle">
                                {(isDone || isFinalized) && (
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                            {!isLast && (
                                <div className={`stepper-line ${nextStepIsActiveOrDone ? 'active' : 'inactive'}`} />
                            )}
                        </div>
                        <div className="stepper-right-column">
                            <h4 className="stepper-title">{step.title}</h4>
                            {step.description && (isActive || (isDone && step.showDescriptionIfDone)) && (
                                <p className="stepper-description">{step.description}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MobileStepper;
