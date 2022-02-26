import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { Magic, MagicSDKExtensionsOption } from 'magic-sdk';

var magic: InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>> | undefined = undefined;

export const createMagic = () =>
{
    if (typeof window !== 'undefined' || !magic)
    {
        magic = new Magic(process.env.MAGIC_PUBLIC_KEY!);
    }
    return magic;
};