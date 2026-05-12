export const menuButtonPt = {
  root: {
    class: [
      '!h-11',
      '!w-11',
      '!border-transparent',
      '!bg-transparent',
      '!text-surface-700',
      '!shadow-none',
      'transition-all',
      'duration-200',
      'hover:enabled:-translate-y-px',
      'hover:enabled:!bg-slate-100/80',
      'hover:enabled:!text-brand-700',
      'focus-visible:!outline-none',
      'focus-visible:!ring-2',
      'focus-visible:!ring-brand-200',
    ],
  },
}

export const localePt = {
  root: {
    class: [
      '!min-w-[4.7rem]',
      '!rounded-full',
      '!border-transparent',
      '!bg-transparent',
      '!shadow-none',
    ],
  },
  label: {
    class:
      '!px-3 !py-1.5 !text-[0.76rem] !font-extrabold !tracking-[0.08em] !text-surface-900',
  },
  dropdown: {
    class: '!w-7 !text-surface-500',
  },
}
