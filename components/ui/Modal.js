import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IconX } from '@tabler/icons-react';

/**
 * Modal component for displaying content in a dialog
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}) {
  const cancelButtonRef = useRef(null);
  
  // Determine modal width based on size prop
  const getModalSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'sm:max-w-md';
      case 'lg':
        return 'sm:max-w-4xl';
      case 'xl':
        return 'sm:max-w-6xl';
      case 'full':
        return 'sm:max-w-full sm:mx-4';
      case 'md':
      default:
        return 'sm:max-w-lg';
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        initialFocus={cancelButtonRef} 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${getModalSizeClass()}`}
              >
                {/* Modal Header (if title is provided) */}
                {title && (
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      {showCloseButton && (
                        <button
                          type="button"
                          className="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close</span>
                          <IconX size={20} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* If no title but we want a close button, add it to the top right */}
                {!title && showCloseButton && (
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <IconX size={20} aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Modal Content */}
                <div className={`${!title ? 'pt-5' : ''}`}>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
