import fs from 'fs';
import bcrypt from 'bcryptjs';
import { toAbsoluteUploadPath } from '../config/paths.js';
import { createAuthToken } from '../utils/createAuthToken.js';
import { formatUser } from '../utils/formatUser.js';
import { getUploadedPhotoPath } from '../middlewares/uploadMiddleware.js';
import { createUser, findUserByEmail, findUserById, updateUserAvatar } from '../models/userModel.js';
import { validateLogin, validateSignup } from '../validators/authValidators.js';

function authResponse(user) {
  return {
    user: formatUser(user),
    token: createAuthToken(user)
  };
}

function removePreviousAvatar(avatarUrl) {
  if (!avatarUrl || !avatarUrl.startsWith('/uploads/profiles/')) {
    return;
  }

  const absolutePath = toAbsoluteUploadPath(avatarUrl);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

export async function signup(req, res, next) {
  try {
    const validation = validateSignup(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid signup payload.', errors: validation.errors });
    }

    const existingUser = await findUserByEmail(validation.value.email);

    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(validation.value.password, 10);
    const user = await createUser({
      name: validation.value.name,
      email: validation.value.email,
      passwordHash,
      role: validation.value.role
    });

    return res.status(201).json({ data: authResponse(user) });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const validation = validateLogin(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid login payload.', errors: validation.errors });
    }

    const user = await findUserByEmail(validation.value.email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(validation.value.password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json({ data: authResponse(user) });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ data: formatUser(user) });
  } catch (error) {
    return next(error);
  }
}

export async function updateCurrentUserAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const avatarUrl = getUploadedPhotoPath(req.file);
    removePreviousAvatar(user.avatar_url);
    const updatedUser = await updateUserAvatar(req.user.id, avatarUrl);

    return res.status(200).json({ data: formatUser(updatedUser) });
  } catch (error) {
    return next(error);
  }
}
