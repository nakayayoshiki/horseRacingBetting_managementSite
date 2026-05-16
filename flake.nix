{
  description = "Keiba Tracker Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            jdk21
            gradle
            nodejs_20
          ];

          shellHook = ''
            echo "Keiba Tracker Dev Environment Ready"
            java -version 2>&1 | head -1
            echo "Node: $(node --version)"
          '';
        };
      });
}
