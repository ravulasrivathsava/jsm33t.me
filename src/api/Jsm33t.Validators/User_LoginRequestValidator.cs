﻿using Jsm33t.Entities.DTO;
using FluentValidation;

namespace Jsm33t.Validators
{
    public class User_LoginRequestValidator : AbstractValidator<User_LoginRequest>
    {
        public User_LoginRequestValidator()
        {
            RuleFor(x => x.Username)
               .NotEmpty().WithMessage("Username or Email is required")
               .MaximumLength(128).WithMessage("Username too long");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MaximumLength(256).WithMessage("Email too long");
        }
    }
}
