import { Member } from './types';

export const findActiveMember = (id: string, slide: string, members?: Member[]) => {
  if (!members) return;
  return members.find((member) => member.location?.element === id && member.location?.slide === slide);
};

export const getMemberFirstName = (member?: Member) => {
  if (!member) return '';
  return member.profileData.name.split(' ')[0];
};

export const getOutlineClasses = (member?: Member) => {
  if (!member) return '';
  const { color } = member.profileData;
  const { name } = color;
  const { intensity } = color.gradientStart;
  return `outline-${name}-${intensity} before:bg-${name}-${intensity}`;
};
