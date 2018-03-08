angular.module('dog-system')
    .component('imageComponent', {
        templateUrl: 'src/components/popupimage/popupimage.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
        controller: function () {
            var self = this;
        
            self.user = self.resolve.data.pet.user;
            self.pet = self.resolve.data.pet;
            self.filetype = self.resolve.data.pet.image.filetype;
            self.base64 = self.resolve.data.pet.image.base64;

            self.ok = function () {
                self.close();
            };
        }
    });