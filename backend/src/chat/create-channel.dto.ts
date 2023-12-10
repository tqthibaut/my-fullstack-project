export class CreateChannelDto {
	name: string;
	creator: string;
	description?: string;

	isPrivate: boolean;
}